const taxes = {
  basic_sales_tax:
    {
      except_categories: ['book', 'food', 'medical'],
      only_imported: false,
      percentage: 10,
    },
  import_duty:
    {
      except_categories: [],
      only_imported: true,
      percentage: 5,
    },
};

export default taxes;
