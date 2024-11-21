import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { addAction, getState } from './services/actions';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
`;

const Queue = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-gap: 10px;
  grid-auto-rows: minmax(80px, auto);
  gap: 10px;
  justify-items: center;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 10px;
  max-width: 800px;
  width: 100%;
  min-height: 80px;
`;

const Action = styled.div<{ type: string }>`
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 24px;
  color: white;
  border-radius: 8px;
  background-color: ${(props) => {
    switch (props.type) {
      case 'A':
        return '#ff6b6b';
      case 'B':
        return '#4ecdc4';
      case 'C':
        return '#45aaf2';
      default:
        return '#333';
    }
  }};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #555;
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const CreditCounter = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const CreditInfo = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => {
    switch (props.type) {
      case 'A':
        return '#ff6b6b';
      case 'B':
        return '#4ecdc4';
      case 'C':
        return '#45aaf2';
      default:
        return '#333';
    }
  }};
  color: white;
`;

export default function FifoQueue() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['state'],
    queryFn: getState,
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Erreur dans la récupération des actions', {
        variant: 'error',
      });
    }
  }, [isError]);

  async function onAddAction(type: string) {
    try {
      await addAction(type);
      queryClient.invalidateQueries({ queryKey: ['state'] });
    } catch (error) {
      enqueueSnackbar(`Erreur dans l'ajout de l'action : ${type}`, {
        variant: 'error',
      });
    }
  }

  return (
    <QueueContainer>
      <h1>File d'attente FIFO</h1>
      {data && (
        <>
          <CreditCounter>
            {Object.entries(data.credits).map(([type, count]) => (
              <CreditInfo key={type} type={type}>
                <div>Action {type}</div>
                <div>Crédits: {count}</div>
              </CreditInfo>
            ))}
          </CreditCounter>
          <Queue>
            {data.actions.map((action, index) => (
              <Action key={`action-${index}`} type={action}>
                {action}
              </Action>
            ))}
          </Queue>
          <ButtonContainer>
            {['A', 'B', 'C'].map((type) => (
              <Button
                key={`add-action-${type}`}
                onClick={() => onAddAction(type)}
              >
                Ajouter {type}
              </Button>
            ))}
          </ButtonContainer>
        </>
      )}
      {isLoading && <p>Loading...</p>}
    </QueueContainer>
  );
}
