import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { useAuth } from '@hooks/useAuth';

import LogoSvg from '@assets/logo.svg';
import BackgroundImg from '@assets/background.png';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';

type FormDataProps = {
    email: string;
    password: string;
}

export function SignIn(){
    const[isLoading, setIsLoading] =  useState(false);

    const { signIn } = useAuth();
    const navigation = useNavigation<AuthNavigatorRoutesProps>();
    const toast = useToast();
    
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>();

    function handleNewAccount() {
        navigation.navigate('signUp');
    }

    async function handleSignIn({ email, password }: FormDataProps ) {
        try{
            setIsLoading(true);
            await signIn(email, password);

        } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "couldn't log in, try again."

        setIsLoading(false);

        toast.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
        });
    }
}
 
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <VStack flex={1} px={10} pb={16}>
            <Image
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt="People training"
            resizeMode="contain"
            position="absolute"
            />


        <Center my={24}>
            <LogoSvg />
            
            <Text color="gray.100" fontSize="sm">
                Train your mind and body
            </Text>
        </Center>

    <Center>
        <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Access your account
        </Heading>

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
                 placeholder="Password"
                 secureTextEntry
                 onChangeText={onChange}
                 value={value}
                 errorMessage = {errors.password?.message}
                />
                )}
        />

        <Button 
        title="Access" 
        onPress={handleSubmit(handleSignIn)}
        isLoading={isLoading}
        />
    </Center>

<Center mt={24}>
    <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
        Don't have access yet?
    </Text>

        <Button 
        title="Create Account" 
        variant="outline"
        onPress={handleNewAccount}
        />
    </Center>
  </VStack>
</ScrollView>
    );
}