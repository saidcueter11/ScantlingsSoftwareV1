import React, { type SyntheticEvent } from 'react'

export const FormContainer = ({ handleSubmit, children }: { handleSubmit: (e: SyntheticEvent<HTMLFormElement>) => void, children: React.ReactNode }) => {
  return (
    <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 gap-4 flex flex-col min-h-full max-w-xs sm:max-w-xl lg:max-w-4xl xl:max-w-7xl mt-5">
      {children}
    </form>
  )
}
