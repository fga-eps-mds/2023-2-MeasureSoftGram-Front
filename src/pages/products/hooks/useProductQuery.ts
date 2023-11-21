import { ProductFormData, productQuery } from '@services/product';

export const useProductQuery = () => {
  const createProduct = async (data: ProductFormData): Promise<Result<ProductFormData>> => {
    return await productQuery.createProduct(data);
  };

  const getProductById = async (organizationId: string, productId: string): Promise<Result<ProductFormData>> =>
    productQuery.getProductById(organizationId, productId);

  const updateProduct = async (productId: string, data: ProductFormData): Promise<Result<ProductFormData>> =>
    productQuery.updateProduct(productId, data);

  const deleteProduct = async (productId: string, organizationId: string | undefined): Promise<Result<void>> => {
    return await productQuery.deleteProduct(productId, organizationId);
  };
  return {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
  };
};
