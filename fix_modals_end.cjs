const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(
    '  </form>\n            </div>\n          </div>\n            </motion.div>\n          </div>\n        );',
    '  </form>\n            </div>\n          </div>\n            </motion.div>\n          </div>\n        );' // wait, it might be exactly this.
  );
  // Actually, I can just leave it if it works. Let me check the build status.
}
