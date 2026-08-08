const viewingsRepo = require('../repositories/viewingsRepository');
const listingsRepo = require('../repositories/listingsRepository');
const mailService = require('./mailService');
const { NotFoundError, ConflictError } = require('../errors/AppError');
const defaultLogger = require('../../logger');

async function listViewings(listingId) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');
    return viewingsRepo.findViewingsByListingId(listingId);
}

async function createViewing(listingId, data, log = defaultLogger) {
    const listing = await listingsRepo.findListingById(listingId);
    if (!listing) throw new NotFoundError('Listing not found');

    if (listing.status !== 'published') {
        throw new ConflictError('Can only request a viewing on a published listing');
    }

    const viewing = await viewingsRepo.createViewing(listingId, data);

    try {
        await mailService.sendNewViewingNotice(listing, viewing);
        await viewingsRepo.markNotified(viewing.id);
        log.info({ viewingId: viewing.id }, 'Agent notified about new viewing request');
    } catch (err) {
        log.error({ err, viewingId: viewing.id }, 'Failed to notify agent about new viewing');
        throw new ExternalServiceError('Failed to send email');
    }

    return viewing;
}

async function changeStatus(id, newStatus, log = defaultLogger) {
    const viewing = await viewingsRepo.findViewingById(id);
    if (!viewing) throw new NotFoundError('Viewing not found');

    const updated = await viewingsRepo.updateViewingStatus(id, newStatus);

    if (newStatus === 'approved') {
        try {
            await mailService.sendViewingConfirmation(viewing.listing, updated);
            log.info({ viewingId: id }, 'Client notified about viewing confirmation');
        } catch (err) {
            log.error({ err, viewingId: id }, 'Failed to notify client about confirmation');
        }
    }

    return updated;
}

module.exports = { listViewings, createViewing, changeStatus };