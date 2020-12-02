import { BackendApiServicePath } from 'src/app/pricing/rest-service-paths/BackendApiServicePath';

export class CoreRestServicePaths{

    public static AUTHENTICATE() : string{
        return BackendApiServicePath.BACKEND_API() + 'api/authenticate';
    }
}