import re

with open("src/hooks/useAppController.tsx", "r") as f:
    content = f.read()

# Add event listener for app_data_changed inside useAppController
# We can find the end of fetchDataSilent and put it there.

injection = """
  useEffect(() => {
    const handleDataChanged = (e: any) => {
        // debounce fetch
        if ((window as any)._dataChangeTimeout) {
            clearTimeout((window as any)._dataChangeTimeout);
        }
        (window as any)._dataChangeTimeout = setTimeout(() => {
            fetchDataSilent();
        }, 300);
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('app_data_changed', handleDataChanged);
        return () => window.removeEventListener('app_data_changed', handleDataChanged);
    }
  }, []);
"""

content = content.replace("const fetchDataSilent = async () => {", injection + "\n  const fetchDataSilent = async () => {")

with open("src/hooks/useAppController.tsx", "w") as f:
    f.write(content)
