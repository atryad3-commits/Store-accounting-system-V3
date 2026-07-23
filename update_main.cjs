const fs = require('fs');

let content = fs.readFileSync('src/main.tsx', 'utf8');

const importStatement = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
`;

content = content.replace(`import { AuthProvider }`, `${importStatement}import { AuthProvider }`);

const initQueryClient = `const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
`;

content = content.replace(`const Root = () => {`, `${initQueryClient}\nconst Root = () => {`);

const newProvider = `
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} position="bottom" />}
        </QueryClientProvider>
`;

content = content.replace(
  `<BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
        </BrowserRouter>`, 
  newProvider
);

fs.writeFileSync('src/main.tsx', content);
console.log("Updated main.tsx with QueryClientProvider");
