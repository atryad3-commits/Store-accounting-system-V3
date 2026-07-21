with open('src/components/modals/EditReceiptModal.tsx', 'r') as f:
    c = f.read()

c = c.replace('.map(p => (', '.map((p, idx) => (')
c = c.replace('key={p.id}', 'key={`${p.id}-${idx}`}')

c = c.replace('.map(acc => (', '.map((acc, idx) => (')
c = c.replace('key={acc.id}', 'key={`${acc.id}-${idx}`}')

c = c.replace('.map(cb => (', '.map((cb, idx) => (')
c = c.replace('key={cb.id}', 'key={`${cb.id}-${idx}`}')

c = c.replace('.map(cb => {', '.map((cb, idx) => {')

with open('src/components/modals/EditReceiptModal.tsx', 'w') as f:
    f.write(c)
