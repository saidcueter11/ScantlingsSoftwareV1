import { type ReactNode, useState, useRef, useEffect } from 'react'

export const CollapsibleRow = ({ title, children, isOpen }: { title: string, children: ReactNode, isOpen: boolean }) => {
  const [open, setOpen] = useState(isOpen)
  const [maxHeight, setMaxHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (contentRef.current !== null) {
      setMaxHeight(open ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [open, contentRef])

  const toggleCollapse = () => {
    setOpen(!open)
  }

  return (
    <div className={`${isOpen ? '' : 'hidden'}`}>
      {
        title.length !== 0 && <button className="w-full text-left p-2 font-bold" onClick={toggleCollapse}>{title}</button>
      }
      <div ref={contentRef} style={{ maxHeight }} className="overflow-hidden transition-max-height duration-500 ease-in-out">
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  )
}
