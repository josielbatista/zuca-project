import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const PHOTO_SIZE = 33;

export function Profile() {
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState('https://github.com/josielbatista.png')

    const toast = useToast();

    async function handleUserPhotoSelect(){
        setPhotoIsLoading(true);

        try {
        const photoSelected =  await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4,4],
            allowsEditing: true,
        });

        if (photoSelected.canceled) {
            return;
        }

        if (photoSelected.assets[0].uri) {
            const photoInfo = await FileSystem.getInfoAsync(
              photoSelected.assets[0].uri,
              { size: true },
            );

            if (photoInfo.exists && (photoInfo.size / 1024 / 1024) > 5) {
               return toast.show({
                title: 'Esta imagem é muito grande. Escolha uma com o máximo de 5MB.',
                placement: 'top',
                duration: 3000,
                bgColor: 'red.500'
               });
            }

            setUserPhoto(photoSelected.assets[0].uri);
        }          
    } catch (error) {
        console.log(error);        
    } finally {
        setPhotoIsLoading(false);
    }
    } 

    return (
        <VStack flex={1} bg="green.150">
            <ScreenHeader title="Perfil"/>

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={6} px={10}>
                {
                photoIsLoading ?
                <Skeleton 
                w={PHOTO_SIZE} 
                h={PHOTO_SIZE} 
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
                />
                :       
                <UserPhoto
                    source={{ uri: userPhoto }}
                    alt="User photo"
                    size={PHOTO_SIZE}
                />
                }

                <TouchableOpacity onPress={handleUserPhotoSelect}>
                    <Text color="white" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                        Alterar foto
                    </Text>
                </TouchableOpacity>

                    <Input
                        bg="green.50"
                        placeholder="Nome"
                        placeholderTextColor="white"
                    />
                    
                    <Input
                        bg="gray.600"
                        placeholder="E-mail"
                        placeholderTextColor="white"
                        isDisabled
                    />
               

                
                    <Heading color="white" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
                        Mudar senha
                    </Heading>

                    <Input
                        bg="green.50"
                        placeholder="Senha antiga"
                        placeholderTextColor="white"
                        secureTextEntry
                    />

                    <Input
                        bg="green.50"
                        placeholder="Nova senha"
                        placeholderTextColor="white"
                        secureTextEntry
                    />

                    <Input
                        bg="green.50"
                        placeholder="Confirme a nova senha"
                        placeholderTextColor="white"
                        secureTextEntry
                    />

                    <Button
                        title="Atualizar"
                        mt={4}
                    />

                </Center>
            </ScrollView>
        </VStack>
    );
}