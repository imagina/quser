import Vue, { reactive } from 'vue'
import State from './contract/pageLoadRequests.contract'
import qRampStore from 'src/modules/qramp/_store/qRampStore'
import baseService from '@imagina/qcrud/_services/baseService'
import {
    COMPANY_PASSENGER,
    COMPANY_RAMP
} from 'src/modules/qramp/_components/model/constants';

const state = reactive<State>({
    responsibleList: []
});

export function pageLoadRequests() {

    function setResponsible(data): void {
        state.responsibleList = data
    }

    function getResponsible(): any {
        return state.responsibleList;
    }

    async function getResponsibleList(refresh = false) {
        if (Vue.prototype.$auth && (Vue.prototype.$auth.hasAccess('ramp.work-orders.index') || Vue.prototype.$auth.hasAccess('ramp.passenger-work-orders.index'))) {
            try {
                const API_ROUTE = 'apiRoutes.quser.users'
                const isPassenger = qRampStore().getIsPassenger();
                const companyId = isPassenger ? COMPANY_PASSENGER : COMPANY_RAMP;
                const params = {
                    refresh,
                    params: {
                        filter: {
                            companyId,
                        },
                    },
                };
                const response = await baseService.index(API_ROUTE, params)
                const data = response.data || [];
                setResponsible(data);
            } catch (err) {
                console.log(err)
            }
        }
    }

    async function getAllList(refresh = false): Promise<void> {
        Promise.all([
            getResponsibleList(refresh)
        ]);
    }

    return {
        getAllList,
        getResponsible,
        setResponsible,
    }
}