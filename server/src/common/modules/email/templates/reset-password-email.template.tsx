import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Container } from '@react-email/container'
import { Heading } from '@react-email/heading'
import { Tailwind } from '@react-email/tailwind'
import { Button } from '@react-email/button'
import { Body } from '@react-email/body'
import { Font } from '@react-email/font'
import { Head } from '@react-email/head'
import { Hr } from '@react-email/hr'
import { Section } from '@react-email/section'

import * as React from 'react'

export const ResetPasswordEmail = ({
  resetPasswordLink,
  email,
}: {
  resetPasswordLink: string
  email: string
}) => {
  return (
    <Tailwind>
      <Html>
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          ></Font>
        </Head>
        <Body className="bg-gray-200 py-5">
          <Container className="bg-gray-100 w-full p-5">
            <Section>
              <Heading className="text-xl">Enroudesk</Heading>
            </Section>
            <Hr></Hr>
            <Section className="py-10">
              <Text className="text-gray-600">
                <span className="text-lg">👋</span> Hello,
              </Text>
              <Text className="text-gray-600">
                We've received a request to reset the password for the Enroudesk
                account associated with{' '}
                <span className="font-bold">{email}</span>. No changes have been
                made to your account yet.
              </Text>
              <Text className="text-gray-600">
                You can reset your password by clicking the link bellow:
              </Text>
              <Button
                href={resetPasswordLink}
                className="bg-blue-600 py-2 text-white w-full text-center rounded-md font-medium"
                target="_blank"
              >
                Reset your password
              </Button>
            </Section>
            <Hr></Hr>
            <Section>
              <Text className="text-gray-600 text-xs">Enroudesk</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}

export default ResetPasswordEmail
