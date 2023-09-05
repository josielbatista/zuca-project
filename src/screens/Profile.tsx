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
    const [userPhoto, setUserPhoto] = useState('https://github.com/itscrazyy.png')

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
                title: 'This image is very large. Choose one up to 5MB.',
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
        <VStack flex={1}>
            <ScreenHeader title="Profile" />

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
                    <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
                        Change photo
                    </Text>
                </TouchableOpacity>

                    <Input
                        bg="gray.600"
                        placeholder="Nome"
                    />
                    
                    <Input
                        bg="gray.600"
                        placeholder="E-mail"
                        isDisabled
                    />
               

                
                    <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
                        Change password
                    </Heading>

                    <Input
                        bg="gray.600"
                        placeholder="Old password"
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder="New password"
                        secureTextEntry
                    />

                    <Input
                        bg="gray.600"
                        placeholder="Confirm the new password"
                        secureTextEntry
                    />

                    <Button
                        title="Update"
                        mt={4}
                    />

                </Center>
            </ScrollView>
        </VStack>
    );
}