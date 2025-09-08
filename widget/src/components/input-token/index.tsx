'use client'

import React, { ChangeEvent, useState } from 'react'
import { Card } from '../card'

export function InputToken() {
  const [numberValue, setNumberValue] = useState('')

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (/^\d*\.?\d*$/.test(value)) {
      setNumberValue(value)
    }
  }

  return (
    <div>
      <Card className="w-full px-4 py-3">
        <input
          type="text"
          value={numberValue}
          onChange={handleNumberChange}
          className="text-lg bg-transparent"
          placeholder="0.0"
        />
      </Card>
    </div>
  )
}
