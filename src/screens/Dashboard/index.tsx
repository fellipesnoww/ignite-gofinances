import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';

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
  TransactionList,
  LoadContainer
} from './styles';


export interface DataListProps extends TransactionCardProps{
  id: string;
}

interface HighlightProps{
  amount: string;
  lastTransactions: string;
}

interface HighlightData{
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard(){
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [isLoading, setIsLoading] = useState(true);

  const dataKey = '@gofinance:transactions';
  const theme = useTheme();

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){
    const lastTransaction = new Date(Math.max.apply(Math, collection
      .filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date).getTime())
    ));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
      month: 'long'
    })}`;
  }

  let entriesTotal = 0;
  let expensiveTotal = 0;

  async function loadTransactions(){
    
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormated: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.type === 'positive'){
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

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
    
    setTransactions(transactionsFormated);
    
    const lastTransactionsEntries = getLastTransactionDate(transactions, "positive");
    const lastTransactionsExpensives = getLastTransactionDate(transactions, "negative");
    const totalInterval = `01 a ${lastTransactionsExpensives}`;

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-Br', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última entrada dia ${lastTransactionsEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-Br', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: `Última saída dia ${lastTransactionsExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-Br', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransactions: totalInterval
      }
    });
    
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  useEffect(() => {
    loadTransactions();
  }, []);
  
  return (
    <Container>
      {
        isLoading ?
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size="large"
          />
        </LoadContainer>
        :
        <>
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
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransactions}
            />
            <HighlightCard 
              type="down"
              title="Saídas" 
              amount={highlightData.expensives.amount}
              lastTransaction={highlightData.expensives.lastTransactions}
            />
            <HighlightCard 
              type="total"
              title="Total" 
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransactions}
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionList 
              data={transactions}          
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TransactionCard data={item}/>
              )}
            />
          </Transactions>
        </>
      }   
    </Container>
  );
}