import { useState, useEffect } from 'react';

export type TIngredient = {
    name: string;
    unit: string;
    amount: number;
    required: boolean;
};

export type TDrink = {
    name: string;
    recipe: string;
    image: string;
    ingredients: TIngredient[];
};

export type TApiData = {
    ingredients: string[];
    drinks: TDrink[];
}

export type TApiResponse = {
    status: number;
    statusText: string;
    data: TApiData | undefined;
    error: any;
    loading: boolean;
    reload: Function;
};

export const useApiGet = (url: string): TApiResponse => {
    const [status, setStatus] = useState<number>(0);
    const [statusText, setStatusText] = useState<string>('');
    const [data, setData] = useState<TApiData>();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [rand, setRand] = useState<boolean>(true);

    const getAPIData = async () => {
        setLoading(true);
        try {
            const apiResponse = await fetch(url);
            const json = await apiResponse.json();
            setStatus(apiResponse.status);
            setStatusText(apiResponse.statusText);
            setData(json as TApiData);
        } catch (error) {
            setError(error);
        }
        setLoading(false);
    };


    useEffect(() => {
        getAPIData();
    }, [rand]);

    const reload = (args: any[]) => {
        setRand(!rand);
    }
    return { status, statusText, data, error, loading, reload};
};