import { TitleSection } from 'components'
import * as S from 'styles/pages/404'
import { c } from 'theme'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()
  return (
    <>
      <TitleSection title="Erro 404" />
      <c.Container>
        <S.ContainImg>
          <Image
            src="/img/not-found.svg"
            alt="Erro 404"
            width={400}
            height={400}
          />
        </S.ContainImg>

        <S.Paragraph>
          Página não encontrada! Por favor, verifique a url acessada.
          <br />
          <br />
          Caso prefira, clique no botão abaixo e retorne para a página inicial:
        </S.Paragraph>
        <S.BtnHome onClick={() => router.push('/')}>Página Inicial</S.BtnHome>
      </c.Container>
    </>
  )
}
