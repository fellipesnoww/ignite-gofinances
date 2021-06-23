import React, { useState } from 'react';
import { 
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert 
} from 'react-native';

import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';


import { Button } from '../../components/Form/Button';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';


interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('O Valor nao pode ser negativo')
        .required('O valor é obrigatório')
});

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsType,
} from './styles';
import { useNavigation } from '@react-navigation/native';


export function Register(){
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',        
    });    


    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const navigation = useNavigation();

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData){
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação');

        if(category.key === 'category')
            return Alert.alert('Selecione a categoria');

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            category: category.key,
            type: transactionType,
            date: new Date(),            
        };

        try {
            const dataKey = '@gofinance:transactions';

            const data = await AsyncStorage.getItem(dataKey);

            const currentData = data ? JSON.parse(data!) : [];

            const dataFormated = [
                ...currentData,
                newTransaction
            ];
            
            AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            reset();
            navigation.navigate('Listagem');
            
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar");            
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema)
    });
   
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>
                    <InputForm 
                        placeholder="Nome" 
                        name="name"
                        control={control}
                        autoCapitalize="sentences"
                        autoCorrect={false}
                        error={errors.name && errors.name.message}                    
                    />
                    <InputForm 
                        placeholder="Preço" 
                        name="amount"
                        control={control}
                        keyboardType="numeric"
                        error={errors.amount && errors.amount.message}                    
                    />
                    <TransactionsType>
                        <TransactionTypeButton
                            title="Income"
                            type="positive"
                            onPress={() => handleTransactionTypeSelect('positive')}
                            isActive={transactionType === 'positive'}
                        />
                        <TransactionTypeButton 
                            title="Outcome"
                            type="negative"
                            onPress={() => handleTransactionTypeSelect('negative')}
                            isActive={transactionType === 'negative'}
                        />
                    </TransactionsType>
                    <CategorySelectButton 
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    />
                </Fields>
                <Button 
                    title="Enviar"
                    onPress={handleSubmit(handleRegister)}
                />
            </Form>
            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>
    </TouchableWithoutFeedback>
    );
}
