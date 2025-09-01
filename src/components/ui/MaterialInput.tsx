import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

interface MaterialInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  showToggle?: boolean
}

export function MaterialInput({ label, id, className, type = "text", showToggle = false, ...props }: MaterialInputProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={showToggle ? (show ? "text" : "password") : type}
        placeholder=" "
        className={cn(
          "peer block w-full rounded-md border-1 border-gray-300 bg-transparent p-4 text-sm text-gray-900 focus:border-blue-500 focus:border-2 focus:ring-0 focus:outline-none",
          className
        )}
        {...props}
      />
      <label
  htmlFor={id}
  className="absolute left-3 top-3 text-gray-500 text-sm transition-all 
    peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 
    peer-focus:top-[-8] peer-focus:text-xs peer-focus:text-blue-600 peer-focus:px-1 bg-white
    peer-not-placeholder-shown:top-[-8] peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-700 peer-not-placeholder-shown:px-1"
>
  {label}
</label>


      {showToggle && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  )
}
