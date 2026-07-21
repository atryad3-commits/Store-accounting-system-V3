import re

with open('server.ts', 'r') as f:
    content = f.read()

# Make sure we don't return duplicate 'default'
# Let's inspect the /api/databases route
