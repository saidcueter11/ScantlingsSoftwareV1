export const Label = ({ question, htmlFor, title }: { question: string, htmlFor: string, title?: string }) => {
  return (
    <label className='xl:w-96 2xl:w-[600px]' htmlFor={htmlFor} title={title}>
      {question}
    </label>
  )
}
