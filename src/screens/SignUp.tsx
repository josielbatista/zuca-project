import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { api } from '@services/api';

import LogoSvg from '@assets/logonova.svg';
import BackgroundImg from '@assets/background_login.png';

import { AppError } from '@utils/AppError';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Enter the name.'),
    email: yup.string().required('Enter the e-mail.').email('Invalid e-mail.'),
    password: yup.string().required('Enter password').min(6, 'The password must have at least 6 digits.'),
    password_confirm: yup.string().required('Confirm password.').oneOf([yup.ref('password')], 'Password does not match')
});

export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();
    const {signIn} = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    
    const navigation = useNavigation();
    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSignUp({ name, email, password }: FormDataProps ) {
        try {
         setIsLoading(true);

         await api.post('/users', { name, email, password });
         await signIn(email, password);
         
        } catch (error) {
          const isAppError = error instanceof AppError;
          const title = isAppError ? error.message : 'The account could not be created. Please try again later.'

          toast.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
          });
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1} bg="green.150" px={10} pb={16}>
            <Image
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt="People training"
            resizeMode="contain"
            position="absolute"
             />


        <Center flex={1} top={1} my={24}>
            <LogoSvg />
            
            <Text color="gray.100" fontSize="sm" mt={-7}>
                Conecte-se e partilhe experiências
            </Text>
        </Center>

    <Center>
        <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
        </Heading>

        <Controller 
            control={control}
            name="name"
            render={({ field: { onChange, value }}) => (
                <Input 
                 placeholder="Nome"
                 onChangeText={onChange}
                 value={value}
                 errorMessage = {errors.name?.message}

               />
            )}
        />
       
        <Controller 
            control={control}
            name="email"
            render={({ field: { onChange, value }}) => (
             <Input 
                placeholder="E-mail" 
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage = {errors.email?.message}
            />
         )}
        />

        <Controller 
            control={control}
            name="password"
            render={({ field: { onChange, value }}) => (
             <Input 
                placeholder="Senha" 
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage = {errors.password?.message}
        />
            )}
        />
        <Controller 
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value }}) => (
             <Input 
                placeholder="Confirme sua senha" 
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                errorMessage = {errors.password_confirm?.message}
        />
            )}
        />

        <Button 
        title="Criar e acessar" 
        onPress={handleSubmit(handleSignUp)}
        isLoading={isLoading}
        />
    </Center>

    <Button 
        title="Voltar para o login" 
        variant="outline" 
        mt={12}
        onPress={handleGoBack}
    />
  </VStack>
</ScrollView>
    );
}