import * as LaunchPadInterface from "../utils/launchpad-types"

const FormField: React.FC<LaunchPadInterface.FormFieldProps> = ({
  label,
  type = "text",
  ...props
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white"
      {...props}
    />
  </div>
);


export default FormField;