
export const Container:React.FC<{children: React.ReactNode,className?:string}> = ({children,className,...props}:{children:React.ReactNode,className?:string}) => {
  return (
    <div className={`container mx-auto px-4  ${className}`}
     {...props}
    >
        {children}
    </div>
  )
}
