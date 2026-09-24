import { useEffect, useState } from "react";

type Province = {
    id: number;
    name: string;
    name_en?: string;
    short?: string;
    short_en?: string;
    region_id?: number;
}

type District = {
    id: number;
    name: string;
    chw_id: number;
    amp_id: number;
}

type Subdistrict = {
    id: number;
    name: string;
    chw_id: number;
    amp_id: number;
    tam_id: number;
}

export function useProvinces() {
    const [data, setData] = useState<Province[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProvinces() {
            try {
                setIsLoading(true)

                const response = await fetch(`/api/changwats`, { method: 'GET' })
                const { data: provinces } = await response.json()

                if (response.ok) {
                    setData(provinces)
                }
            } catch (error) {
                console.log(error);
                setError((error as { message: string }).message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProvinces()
    }, [])

    return { data, isLoading, error }
}

export function useDistricts(province: string | null) {
    const [data, setData] = useState<District[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchDistricts() {
            try {
                setIsLoading(true)

                const response = await fetch(`/api/amphurs/changwat/${province}`, { method: 'GET' })
                const { data: districts } = await response.json()

                if (response.ok) {
                    setData(districts)
                }
            } catch (error) {
                console.log(error);
                setError((error as { message: string }).message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDistricts()
    }, [province])

    return { data, isLoading, error }
}

export function useSubdistricts(district: string | null) {
    const [data, setData] = useState<Subdistrict[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchSubdistricts() {
            try {
                setIsLoading(true)

                const response = await fetch(`/api/tambons/amphur/${district}`, { method: 'GET' })
                const { data: subdistricts } = await response.json()

                if (response.ok) {
                    setData(subdistricts)
                }
            } catch (error) {
                console.log(error);
                setError((error as { message: string }).message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSubdistricts()
    }, [district])

    return { data, isLoading, error }
}