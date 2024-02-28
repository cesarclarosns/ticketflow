import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Font } from '@react-email/font';
import { Head } from '@react-email/head';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Tailwind } from '@react-email/tailwind';
import { Text } from '@react-email/text';
import * as React from 'react';

export const ResetPasswordEmail = ({
  resetPasswordLink,
  email,
}: {
  resetPasswordLink: string;
  email: string;
}) => {
  return (
    <Tailwind>
      <Html>
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              format: 'woff2',
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          ></Font>
        </Head>
        <Body className="bg-gray-200 py-5">
          <Container className="bg-gray-100 w-full p-5">
            <Section>
              <Heading className="text-xl">TicketFlow</Heading>
            </Section>
            <Hr></Hr>
            <Section className="py-10">
              <Text className="text-gray-600">
                <span className="text-lg">👋</span> Hello,
              </Text>
              <Text className="text-gray-600">
                We've received a request to reset the password for the
                TicketFlow account associated with{' '}
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
              <Text className="text-gray-600 text-xs">TicketFlow</Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default ResetPasswordEmail;
