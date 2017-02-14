export const createTask = (payload) => ({ type: 'CREATE_TASK', payload })
export const deleteTask = (id) => ({ type: 'DELETE_TASK', id })
export const updateTask = (payload) => ({ type: 'UPDATE_TASK', payload })
