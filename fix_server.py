import sys

with open('server.ts', 'r') as f:
    content = f.read()

if 'from \'node:async_hooks\'' not in content:
    content = content.replace("import express from 'express';", "import express from 'express';\nimport { AsyncLocalStorage } from 'node:async_hooks';\nconst storeContext = new AsyncLocalStorage<string>();\n")

with open('server.ts', 'w') as f:
    f.write(content)
