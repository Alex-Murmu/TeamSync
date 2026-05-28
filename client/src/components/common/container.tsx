
export const Container = ({children,className,...props}:{children:React.ReactNode,className?:string}) => {
  return (
    <div className={`container mx-auto px-4  ${className}`}
     {...props}
    >
        {children}
    </div>
  )
}
