const fs = require('fs');
let content = fs.readFileSync('src/components/modals/PersonIOModal.tsx', 'utf8');

content = content.replace(
  'showNotification(\n                                              "فرمت فایل پشتیبانی نمی‌شود. فایل خروجی استاندارد نیست.",\n                                            );',
  'showNotification(\n                                              "فرمت فایل پشتیبانی نمی‌شود. فایل خروجی استاندارد نیست.",\n                                              "error"\n                                            );'
);

content = content.replace(
  'showNotification(\n                                            "خطا در خواندن فایل JSON. از صحت فایل مطمئن شوید.",\n                                          );',
  'showNotification(\n                                            "خطا در خواندن فایل JSON. از صحت فایل مطمئن شوید.",\n                                            "error"\n                                          );'
);

content = content.replace(
  'showNotification(\n                                                "خطا در خواندن فایل. لطفاً فرمت مناسبی را انتخاب نماید.",\n                                              );',
  'showNotification(\n                                                "خطا در خواندن فایل. لطفاً فرمت مناسبی را انتخاب نماید.",\n                                                "error"\n                                              );'
);

fs.writeFileSync('src/components/modals/PersonIOModal.tsx', content);
