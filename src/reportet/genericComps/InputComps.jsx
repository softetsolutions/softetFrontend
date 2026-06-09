/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  required,
  style,
  key,
  inputClassName,
}) => (
  <div style={style} key={key}>
    <label className="block text-sm font-medium">
      {label} {required && <span className=" text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={
        "w-full p-2 border rounded mt-1" +
        (inputClassName ? inputClassName : "")
      }
    />
  </div>
);

// const optionsPropStructure = [{
//   name:"Area",
//   value:'area'
// },{
//   name:"Doctor",
//   value:"doctor",
// }]

export const Select = ({
  selectName,
  labelName,
  value,
  onChange,
  required,
  options,
}) => (
  <div>
    <label htmlFor={labelName} className="block text-sm font-medium">
      {selectName} {required && <span className=" text-red-500">*</span>}
    </label>
    <select
      name={labelName}
      className="w-full p-2 border rounded mt-1"
      onChange={onChange}
      value={value}
    >
      <option value="">Choose {labelName}</option>
      {(options || [])?.map((option) => (
        <option key={option?.name} value={option?.value}>
          {option?.name}
        </option>
      ))}
    </select>
  </div>
);
