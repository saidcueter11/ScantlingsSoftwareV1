export const Label = ({ question, htmlFor }: { question: string, htmlFor: string }) => {
  return (
    <label className='break-words' htmlFor={htmlFor}>
      {question}
    </label>
  )
}
