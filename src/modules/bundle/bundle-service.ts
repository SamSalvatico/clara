import BaseService from "../base/base-service";
import ServiceInterface from "../base/service-interface";
import Product from "../product/product-model";
import Bundle from "./bundle-model";

export default class BundleService extends BaseService implements ServiceInterface {
    _collection = 'bundles';

    public async calculateDiscount(products: Product[]) {
        if (products.length < 2) {
            return 0;
        }
        let discOutput = 0;
        const skus = products.map((x: Product) => x.sku);
        const validBundlesCursor = await this.fastifyInstance.mongo.db?.collection(this.collectionName)
            .aggregate(this.bundlePipelineFromSkusArray(skus));
        const validBundles = await validBundlesCursor?.toArray();
        console.log(JSON.stringify(validBundles));
        if (validBundles != null) {
            if (validBundles.length > 0) {
                validBundles.forEach((element: Bundle) => {
                    // a bundle contains a discount percentage to apply to all products referenced
                    const currentProdsToSum = products.filter((p: Product) => {
                        return element.products.includes(p.sku)
                    });
                    console.log("Bundle");
                    console.log(JSON.stringify(element));
                    const currentDiscount = (currentProdsToSum.reduce((a, b) => a + b.price, 0)
                        * element.discount);
                    // the total discount applied must be the maximum appliable across all matching bundle combinations
                    // no more than 1 bundle discount per Cart can be applied
                    if (currentDiscount > discOutput) {
                        discOutput = currentDiscount;
                    }
                });
            } else {
                // when a cart contains more than 5 products without any bundle, then a 6% discount is applied
                if (products.length > 5) {
                    discOutput = (products.reduce((a, b) => a + b.price, 0) / 100) * 6;
                }
            }
        }
        return discOutput;
    }

    private bundlePipelineFromSkusArray(skus: string[]) {
        return [
            { "$match": { "products.1": { "$exists": true } } },
            {
                "$redact": {
                    "$cond": [
                        {
                            "$gte": [
                                { "$size": { "$setIntersection": ["$products", skus] } },
                                2
                            ]
                        },
                        "$$KEEP",
                        "$$PRUNE"
                    ]
                }
            },
            { "$sort": { "_id": 1 } }
        ];
    }
}