#!/bin/bash

# Extract PersonIO states from App.tsx
sed -n '1521,1548p' src/App.tsx > states.txt

# Extract JSX from App.tsx
sed -n '9780,10900p' src/App.tsx > jsx.txt

