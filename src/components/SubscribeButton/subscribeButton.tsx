import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps{
    priceId: string;
}

export function SubscribeButton({priceId}: SubscribeButtonProps){
    const session = useSession()
    const router = useRouter()


    async function handleSubscribe(){
        if(!session){
            signIn('github')
            return;
        }

        // if(session.data!.activeSubscription != null ){
        //     router.push('/posts')
        //     return;
        // }

        try {
            const response = await api.post('/subscribe')
            const {sessionId} = await response.data

         

            const stripe = await getStripeJs()

            await stripe!.redirectToCheckout({sessionId})

        }
        catch(err: any){
                alert(err.message)
        }
    }
    

    return(
        <button type="button" className={styles.subscribeButton} onClick={()=>handleSubscribe()}>
            Subscribe now
        </button>
    )
}