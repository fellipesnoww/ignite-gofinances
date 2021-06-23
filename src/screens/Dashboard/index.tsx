import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,  
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList
} from './styles';
import { useFocusEffect } from '@react-navigation/native';

export interface DataListProps extends TransactionCardProps{
  id: string;
}

export function Dashboard(){
  const [data, setData] = useState<DataListProps[]>([]);
  const dataKey = '@gofinance:transactions';

  async function loadTransactions(){
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormated: DataListProps[] = transactions
    .map((item: DataListProps) => {
      const amount = Number(item.amount).toLocaleString('pt-Br', {
        style: 'currency',
        currency: 'BRL'
      });
      
      const date = Intl.DateTimeFormat('pt-BR',{
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }

    });  

    setData(transactionsFormated);
    
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  useEffect(() => {
    loadTransactions();
  }, [])

  return (
    <Container>   
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{uri: 'https://avatars.githubusercontent.com/u/48105194?v=4'}}/>
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Fellipe</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power"/>
          </LogoutButton>        
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          type="up" 
          title="Entradas" 
          amount="R$ 17.400,00" 
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard 
          type="down"
          title="Saídas" 
          amount="R$ 1.259,00" 
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard 
          type="total"
          title="Total" 
          amount="R$ 16.141,00" 
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionList 
          data={data}          
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TransactionCard data={item}/>
          )}
        />
      </Transactions>
    </Container>
  );
}