import re

with open('src/components/persons/PersonsManager.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";')
content = content.replace('import { motion, AnimatePresence } from "framer-motion"; // Note: might need to adjust imports', 'import { motion, AnimatePresence } from "motion/react";')
content = content.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "motion/react";')

with open('src/components/persons/PersonsManager.tsx', 'w') as f:
    f.write(content)
