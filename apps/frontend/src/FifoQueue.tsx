import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { addAction, getState } from './services/actions';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';

const QueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  font-family: Arial, sans-serif;
  max-width: 50rem;
  margin: 0 auto;
`;

const Queue = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  grid-gap: 0.625rem;
  grid-auto-rows: minmax(5rem, auto);
  gap: 0.625rem;
  justify-items: center;
  border: 0.125rem solid #333;
  border-radius: 0.5rem;
  padding: 0.625rem;
  max-width: 50rem;
  width: 100%;
  min-height: 5rem;
`;

const Action = styled.div<{ type: string }>`
  width: 4.375rem;
  height: 4.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  border-radius: 0.5rem;
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
  gap: 0.625rem;
  margin-top: 1.25rem;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 0.3125rem;

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
  gap: 0.625rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`;

const CreditInfo = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.625rem;
  border-radius: 0.3125rem;
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
