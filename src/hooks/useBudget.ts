import { useEffect, useState } from "react";
import api from "../api";

type Plan = {
    id: number;
    plan_no?: string;
    name: string;
    year?: string;
    plan_type_id?: number;
    status?: number;
}

type Project = {
    id: number;
    name: string;
    year?: string;
    project_type_id?: number;
    plan_id?: number;
    division_id?: number;
    owner_id?: number;
    gfmis_id?: string;
    activity_count?: number;
    status?: number;
}

type Activity = {
    id: number;
    activity_no?: string;
    name: string;
    year?: number;
    gfmis_id?: string;
    project_id: number;
    status?: number;
}

export function usePlans(year: number | null) {
    const [data, setData] = useState<Plan[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPlans() {
            try {
                setIsLoading(true)

                const response = await api.get(`/api/budget-plans/year/${year}`)

                if (response?.data) {
                    setData(response.data)
                }
            } catch (error) {
                console.log(error);
                setError((error as { message: string }).message)
            } finally {
                setIsLoading(false)
            }
        }

        if (year) fetchPlans()
    }, [year])

    return { data, isLoading, error }
}

export function useProjects(plan: number | null) {
    const [data, setData] = useState<Project[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProjects() {
            try {
                setIsLoading(true)

                const response = await api.get(`/api/budget-projects/plan/${plan}`)

                if (response?.data) {
                    setData(response.data)
                }
            } catch (error) {
                console.log(error);
                setError((error as { message: string }).message)
            } finally {
                setIsLoading(false)
            }
        }

        if (plan) fetchProjects()
    }, [plan])

    return { data, isLoading, error }
}

export function useActivities(project: number | null) {
    const [data, setData] = useState<Activity[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchActivities() {
            try {
                setIsLoading(true)

                const response = await api.get(`/api/budget-activities/project/${project}`)

                if (response?.data) {
                    setData(response.data)
                }
            } catch (error) {
                console.log(error);
                setError((error as { message: string }).message)
            } finally {
                setIsLoading(false)
            }
        }

        if (project) fetchActivities()
    }, [project])

    return { data, isLoading, error }
}