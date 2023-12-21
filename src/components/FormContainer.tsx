import React, { type SyntheticEvent } from 'react'

export const FormContainer = ({ handleSubmit, children }: { handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => void, children: React.ReactNode }) => {
  return (
    <form onSubmit={handleSubmit} className="xl:grid lg:grid-cols-2 gap-4 flex flex-col min-h-full w-full max-w-4xl lg:mt-5">
      {children}
    </form>
  )
}
