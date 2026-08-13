with open('src/schemas/validation.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'sayadId: z.string().regex(sayadIdRegex, "شناسه صیادی باید دقیقاً ۱۶ رقم باشد"),',
    'sayadId: z.string().regex(sayadIdRegex, "شناسه صیادی باید دقیقاً ۱۶ رقم باشد").optional().nullable().or(z.literal("")),'
)

content = content.replace(
    'amount: z.union([z.number(), z.string()]).refine(val => Number(val) > 0, "مبلغ چک نامعتبر است"),',
    'amount: z.union([z.number(), z.string()]).refine(val => Number(val) >= 0, "مبلغ چک نامعتبر است"),'
)

with open('src/schemas/validation.ts', 'w') as f:
    f.write(content)
