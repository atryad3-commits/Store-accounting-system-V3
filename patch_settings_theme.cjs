const fs = require('fs');
let content = fs.readFileSync('src/components/admin/SettingsTab.tsx', 'utf8');

if (!content.includes('"persian_admin_lte"')) {
    content = content.replace(
        '<option value="classic">',
        '<option value="persian_admin_lte">پوسته Persian AdminLTE (جدید)</option>\n                                      <option value="classic">'
    );
    fs.writeFileSync('src/components/admin/SettingsTab.tsx', content);
    console.log('SettingsTab patched');
}
