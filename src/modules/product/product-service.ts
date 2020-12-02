import BaseService from '../base/base-service';
import ServiceInterface from '../base/service-interface';

export default class ProductService extends BaseService implements ServiceInterface {
    _collection = 'products';
}
