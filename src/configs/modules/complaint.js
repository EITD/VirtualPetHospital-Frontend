const complaint = {
    getComplaintInfo: { method: '/api/community/complaint/page', type: 'post', response: 'json' },
    addComplaintInfo: { method: '/api/community/complaint/create', type: 'post', response: 'json' },
    updateComplaintInfo: { method: '/api/community/complaint/update', type: 'post', response: 'json' },
    deleteComplaintInfo: { method: '/api/community/complaint/batchDelete', type: 'post', response: 'json' },
    replyComplaintInfo: { method: '/api/community/complaint/reply', type: 'post', response: 'json' },
}
export default complaint