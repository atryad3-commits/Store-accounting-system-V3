with open('src/components/modals/PersonFormModal.tsx', 'r') as f:
    content = f.read()

states = """
  const [newPersonLastName, setNewPersonLastName] = useState("");
  const [newPersonGender, setNewPersonGender] = useState("");
  const [newPersonFatherName, setNewPersonFatherName] = useState("");
  const [newPersonAccountingCode, setNewPersonAccountingCode] = useState("");
  const [newPersonCompanyName, setNewPersonCompanyName] = useState("");
  const [newPersonAlias, setNewPersonAlias] = useState("");
  const [newPersonContacts, setNewPersonContacts] = useState<any[]>([]);
  const [newPersonIsActive, setNewPersonIsActive] = useState(true);
  const [newPersonRegistrationDate, setNewPersonRegistrationDate] = useState("");
  const [newPersonGroup, setNewPersonGroup] = useState("");
"""
content = content.replace('const [submittingPerson, setSubmittingPerson] = useState(false);', 'const [submittingPerson, setSubmittingPerson] = useState(false);\n' + states)

content = content.replace('import { User, X, Check, Search, CreditCard, Building, MapPin, Tag } from "lucide-react";', 'import { User, X, Check, Search, CreditCard, Building, MapPin, Tag } from "lucide-react";\nimport DateObject from "react-date-object";\nimport persian from "react-date-object/calendars/persian";\nimport persian_fa from "react-date-object/locales/persian_fa";\nimport CustomDatePicker from "../ui/CustomDatePicker";\nconst DatePicker = CustomDatePicker;')
content = content.replace('import { toPersianDigits } from "../../utils/format";', 'import { toPersianDigits } from "../../utils/format";\nimport CurrencyInput from "../ui/CurrencyInput";')

with open('src/components/modals/PersonFormModal.tsx', 'w') as f:
    f.write(content)
