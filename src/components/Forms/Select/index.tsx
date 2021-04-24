import { useEffect, useRef, useState } from 'react'
import * as S from 'components/Forms/Select/styles'
import { useField } from '@unform/core'
import ReactInputMask, { Props as InputProps } from 'react-input-mask'

interface Props extends InputProps {
  name: string
  id: string
  placeholder: string
  label: string
  type: string
  autoFocus?: boolean
  onKeyPress?: any
  load?: boolean
  setStateInSelect?: string
  options: { value: string; label: string }[]
}

export const Select = ({
  name,
  id,
  placeholder,
  mask,
  onKeyPress,
  load,
  setStateInSelect,
  options,
  ...rest
}: Props) => {
  const [showOption, setShowOption] = useState(false)
  const [valueOption, setValueOption] = useState('')
  const [listOption, setListOption] = useState(options)

  const selectRef = useRef(null)

  const { fieldName, registerField, error, clearError } = useField(name)

  useEffect(() => {
    valueOption.length === 0 && setListOption(options)
  }, [valueOption])

  useEffect(() => {
    setStateInSelect && setValueOption(setStateInSelect)
  }, [setStateInSelect])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  const clearField = () => {
    if (error !== undefined) clearError()
  }

  // verifica se o texto do input corresponde a alguma das options
  const checkValueInOptions = () => options.find(el => el.value === valueOption)

  // ao perder o focus do input limpa o texto digitado se não corresponder a nenhuma das options
  const verifyValue = () => {
    !checkValueInOptions() && setValueOption('')
  }

  // mostra dropdown ao clicar no input
  const showDropdownOptions = () => {
    // verifica se nas options tem o valor digitado no input, se true, mostra todas as options
    checkValueInOptions() && setListOption(options)
    // mostra dropdown
    setShowOption(true)
  }

  // oculta as options ao remover o mouse do input ou das options
  const hiddenDropdownOptions = () => {
    // oculta dropdown
    setShowOption(false)
    // popula options
    setListOption(options)
  }

  // grava option escolhida ao clicar
  const selectOption = (value: string) => {
    // grava valor ao clicar em uma option
    setValueOption(value)
    // oculta dropdown
    setShowOption(false)
    // limpa marcação de erro
    clearField()
  }

  // filtra options ao digitar
  const filterDataOptions = (e: string) => {
    // recebe valor digitado e normaliza
    const valueInput = e
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    // retorna lista de options filtrada que contém o texto digitado
    const filteredOptions = options.filter(el => {
      return (
        el.value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .indexOf(valueInput) > -1
      )
    })

    // troca as options default pela lista filtrada
    setListOption(filteredOptions)
  }

  // detecta alterações nos valores do input ao digitar
  const searchText = (e: string) => {
    // grava valor digitado no input
    setValueOption(e)
    // filtra options ao digitar
    filterDataOptions(e)
  }

  // limpa opção selecionada ao clicar no "x" do input
  const clearSelect = () => {
    // limpa option escolhida
    setValueOption('')
    // popula options
    setListOption(options)
  }

  // mostra options ao clicar no chevron down
  const showOptionsAndFocus = () => {
    // mostra dropdown
    setShowOption(true)
    // coloca o focus no input
    // @ts-ignore
    selectRef.current.focus()
    // popula options
    setListOption(options)
  }

  return (
    <>
      <S.ContainerInput>
        <S.WrapperInput
          error={error}
          onMouseLeave={() => hiddenDropdownOptions()}
        >
          {/* input fake para desabilitar autocomplete */}
          <S.InputHidden type="text" name={name} />
          <ReactInputMask
            autoComplete="new-password"
            name={name}
            id={id}
            placeholder={placeholder}
            {...rest}
            ref={selectRef}
            onInput={clearField}
            mask={mask}
            maskPlaceholder={null}
            value={valueOption}
            onClick={() => showDropdownOptions()}
            onBlur={() => verifyValue()}
            onChange={e => searchText(e.target.value)}
          />
          <label htmlFor={id}>{placeholder}</label>

          <S.ContainerICons>
            <S.IconClose
              onClick={() => clearSelect()}
              showIcon={!!valueOption}
            />
            <S.IconArrowDown onClick={() => showOptionsAndFocus()} />
          </S.ContainerICons>

          {showOption && (
            <S.ContainerOptions>
              {listOption !== undefined &&
                listOption.map(el => (
                  <div key={el.label} onClick={() => selectOption(el.value)}>
                    {el.label}
                  </div>
                ))}
              {listOption?.length === 0 && (
                <div>Nenhum resultado encontrado!</div>
              )}
            </S.ContainerOptions>
          )}
        </S.WrapperInput>
        <S.MsgError error={error}>{error && error}</S.MsgError>
      </S.ContainerInput>
    </>
  )
}
