/* eslint-disable camelcase */
import { useCallback, useState } from 'react';
import getCharacteristicsWithBalanceMatrix from '@utils/getCharacteristicsWithBalanceMatrix';
import { Changes, CharacteristicWithBalanceMatrix, ValuesCommitted } from '@customTypes/project';

export default function useEqualizer( selectedCharacteristics: string[] ) {
  const characteristicWithBalanceMatrix = getCharacteristicsWithBalanceMatrix(selectedCharacteristics)
  const INITIAL_VALUES_COMMITTED = characteristicWithBalanceMatrix.reduce((acc, item) => ({ ...acc, [item.key]: 50}), {})

  const [characteristics, setCharacteristics] = useState<CharacteristicWithBalanceMatrix[]>(characteristicWithBalanceMatrix)
  const [valuesCommitted, setValuesCommitted] = useState<ValuesCommitted>(INITIAL_VALUES_COMMITTED)
  const [changes, setChanges] = useState<Changes[]>([])

  const addDeltaToChanges = useCallback((characteristicIdx: number, newValue: number) => {
    const characteristicDragged = characteristics[characteristicIdx].key as keyof typeof valuesCommitted

    const value = valuesCommitted[characteristicDragged]

    const delta = newValue - value;

    setChanges(prevChanges => [
      ...prevChanges,
      { characteristic_key: characteristicDragged, delta }
    ])

    setValuesCommitted({
      ...characteristics.reduce((acc, item) => ({ ...acc, [item.key]: item.value}), {}),
      [characteristicDragged]: newValue
    })
  }, [])

  const equalize = useCallback((characteristicIdx: number, val: number) => {
    const updatedCharacteristics = characteristics.map(item => item)

    const characteristic = updatedCharacteristics[characteristicIdx]
    const { correlations, value } = characteristic;

    const delta = val - value;

    characteristic.value = val;

    correlations['+'].forEach(characteristicKey => {
      const correlatedCharacteristic = updatedCharacteristics.find(item => item.key === characteristicKey)

      if (correlatedCharacteristic) {
        const newValue = correlatedCharacteristic!.value + delta;
        correlatedCharacteristic!.value = Math.max(0, Math.min(newValue, 100));
      }
    })

    correlations['-'].forEach(characteristicKey => {
      const correlatedCharacteristic = updatedCharacteristics.find(item => item.key === characteristicKey)

      if (correlatedCharacteristic) {
        const newValue = correlatedCharacteristic!.value - delta;
        correlatedCharacteristic!.value = Math.max(0, Math.min(newValue, 100));
      }
    })

    setCharacteristics(updatedCharacteristics)
  }, [])

  return {
    changes,
    characteristics,
    equalize,
    addDeltaToChanges
  }
}
