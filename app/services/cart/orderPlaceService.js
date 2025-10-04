import api from '@/app/redux/services/apiService';



export const OrderService = {

    paymentInit:async(payload= {}) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
            if (!token) throw new Error("No auth token found");
            if (token) {

                try {
                    const response = await api.post(
                        '/v1/shop/payments/phonepe/initiate',
                        payload,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    return response.data;
    
                }
                catch (error){
                    console.error('Error Order placing API:', error);
                }
            }
    },


    orderPlace: async (payload = {}) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
        if (!token) throw new Error("No auth token found");
        if (token) {
            try {
                const response = await api.post(
                    '/v1/shop/cart/checkout/placeorder',
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                return response.data;

            }
            catch (error){
                console.error('Error Order placing API:', error);
            }
        }
    }
}