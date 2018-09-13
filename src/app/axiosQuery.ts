/**
 * Created by jlmconsulting on 9/13/18.
 */
export interface AxiosQuery {
    'getjokes': {
        POST: {
            body: {
                address: string
            }
            response: {
                success: boolean
                eta?: string
            }
        }
    }
    
}