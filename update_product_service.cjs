const fs = require('fs');
let content = fs.readFileSync('src/services/productService.ts', 'utf8');

const queryHooks = `
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useGetProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });
};

export const useGetProductCategories = () => {
  return useQuery({
    queryKey: ['product_categories'],
    queryFn: getProductCategories
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: string, product: any }) => updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
`;

content = content + '\n' + queryHooks;

fs.writeFileSync('src/services/productService.ts', content);
console.log("Updated productService with React Query hooks");
