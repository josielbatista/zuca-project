import { useState } from 'react';
import { Heading, VStack, SectionList, Text } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';

export function History() {
    const [exercises, setExercises]= useState([
    {
        title: "26.07.23",
        data: ["Front pull", "One-sided row"]
    },
    {
        title: "27.07.23",
        data: ["Front pull"]
    },
]);

    return (
        <VStack>
            <ScreenHeader title="Exercise History "/>

            <SectionList 
                sections={exercises}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <HistoryCard />
                )}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={[].length === 0 && { flex:1, justifyContent: 'center'}}
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        There are no registered exercises yet. {'\n'}
                        Shall we exercise today? 
                    </Text>
                )}
            />
        
            
        </VStack>
    );
}